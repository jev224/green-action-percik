export interface ServerErrorOptions {
	message: string;
	ui_message: string;
	status: number;
}

export class ServerError extends Error {
	public readonly ui_message: string;
	public readonly status: number;

	constructor(options: ServerErrorOptions) {
		super(options.message);

		this.name = "ServerError";
		this.ui_message = options.ui_message;
		this.status = options.status;

		Object.setPrototypeOf(this, ServerError.prototype);
	}
}
