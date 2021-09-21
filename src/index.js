import "abortcontroller-polyfill/dist/abortcontroller-polyfill-only.js";

class AbortError extends Error {
	constructor(message = "Aborted") {
		super(message);
		this.name = "AbortError";
	}
}

/**
 * * This class extends Promise and add some extra abilities to it
 * * 1. Add AbortSignal to it and pass to Fetch as well, All the Promises are abortable/cancellable
 * * 2. Add some data to promise and fetch via .data
 * * 3. Get status of Promise using the getter isFulfilled, isSettled, isRejected, status
 */
class AdvancedPromise extends Promise {
	constructor(executor, data = {}) {
		const abortController = new AbortController();
		const abortSignal = abortController.signal;
		var meta = { status: "pending", data: data };

		const normalExecutor = (resolve, reject) => {
			abortSignal.addEventListener("abort", () => {
				reject(new AbortError(this._abortReason));
			});
			var res = (d) => {
				meta.status = "settled";
				if (resolve) resolve(d);
			};
			var rej = (d) => {
				meta.status = "rejected";
				if (reject) reject(d);
			};
			executor(res, rej, abortSignal, data);
		};

		super(normalExecutor);

		this._meta = meta;

		// Bind the abort method
		this.cancel = this.abort = (reason) => {
			this._abortReason = reason ? reason : "Aborted";
			abortController.abort();
		};
	}

	// Getter to access abort reason
	get abortReason() {
		return this._abortReason;
	}

	get data() {
		return this._meat.data;
	}

	get isFulfilled() {
		return this._meta.status !== "pending";
	}

	get isSettled() {
		return this._meta.status !== "settled";
	}

	get isRejected() {
		return this._meta.status !== "rejected";
	}

	get status() {
		return this._meta.status;
	}

	static from = (promise) => {
		if (promise instanceof AdvancedPromise) {
			return promise;
		}

		return new AdvancedPromise((resolve, reject) => {
			promise.then(resolve).catch(reject);
		});
	};
}

export default AdvancedPromise;
