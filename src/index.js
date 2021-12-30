// import "abortcontroller-polyfill/dist/abortcontroller-polyfill-only";

import "../node_modules/abortcontroller-polyfill/dist/abortcontroller-polyfill-only";

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
 * * 4. More features like resolve/reject from outside, timeout for fetch
 */
class AdvancedPromise extends Promise {
	constructor(executor, timeout, data = {}) {
		const abortController = new AbortController();
		const abortSignal = abortController.signal;
		var meta = {
			status: "pending",
			data: data,
			resolve: () => {},
			reject: () => {},
			timeoutId: 0,
			timeoutStatus: undefined,
		};

		const normalExecutor = (resolve, reject) => {
			var res = (d) => {
				if (meta.status === "pending") {
					meta.status = "settled";
					if (resolve) resolve(d);
				}
			};
			var rej = (d) => {
				if (meta.status === "pending") {
					meta.status = "rejected";
					if (reject) reject(d);
				}
			};
			abortSignal.addEventListener("abort", () => {
				rej(new AbortError(this._abortReason));
			});
			meta.resolve = res;
			meta.reject = rej;
			executor(res, rej, abortSignal);
		};

		super(normalExecutor);

		this._meta = meta;

		// Bind the abort method
		this.cancel = this.abort = (reason) => {
			this._abortReason = reason ? reason : "Aborted";
			abortController.abort();
		};

		if (timeout) {
			this._meta.timeoutStatus = false;
			this._meta.timeoutId = setTimeout(() => {
				this._meta.timeoutStatus = true;
				this.abort(`${timeout}ms timeout expired`);
			}, timeout);
		}
	}

	cancelTimeout() {
		if (!this.isFulfilled && this._meta.timeoutId) {
			clearTimeout(this._meta.timeoutId);
			return true;
		}
		return false;
	}

	resolve(data) {
		this._meta.resolve(data);
	}

	reject(reason) {
		this._meta.reject(reason);
	}

	// Getter to access abort reason
	get abortReason() {
		return this._abortReason;
	}

	get data() {
		return this._meta.data;
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

	get isTimedout() {
		return this._meta.timeoutStatus;
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
