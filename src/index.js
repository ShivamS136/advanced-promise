export class AbortError extends Error {
	constructor(message = "Aborted") {
		super(message);
		this.name = "AbortError";
	}
}

/**
 * * This class extends Promise and add some extra abilities to it
 * * 1. Add AbortSignal to it and pass to Fetch as well, All the Promises are abortable/cancellable
 * * 2. Add some data to promise and fetch via .data
 * * 3. Get status of Promise using the getter isFulfilled, isSettled, isRejected
 */
export class AdvancedPromise extends Promise {
	constructor(executor, data = {}) {
		const abortController = new AbortController();
		const abortSignal = abortController.signal;
		var status = { value: 0 };

		const normalExecutor = (resolve, reject) => {
			abortSignal.addEventListener("abort", () => {
				reject(new AbortError(this._abortReason));
			});
			var res = (d) => {
				status.value = 1;
				resolve(d);
			};
			var rej = (d) => {
				status.value = -1;
				reject(d);
			};
			executor(res, rej, abortSignal, data);
		};

		super(normalExecutor);

		this._data = data;
		this._status = status;

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
		return this._data;
	}

	get isFulfilled() {
		return !!this._status.value;
	}

	get isSettled() {
		return this._status.value === 1;
	}

	get isRejected() {
		return this._status.value === -1;
	}
}

module.exports = AdvancedPromise;
