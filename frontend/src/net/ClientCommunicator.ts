import type { Request, Response } from "../../../shared/index";

const BASE_URL = (import.meta.env["VITE_API_BASE_URL"] as string) ?? "";

/**
 * Owns the HTTP verb and transport details of talking to the API. Callers
 * (the ServerFacade) only pick a method and pass a path/body; everything about
 * how a GET/POST/PUT/DELETE is actually issued lives here.
 */
export class ClientCommunicator {
	async get(path: string): Promise<Response> {
		return await this.apiRequest("GET", path);
	}

	async post(path: string, body?: Request): Promise<Response> {
		return await this.apiRequest("POST", path, body);
	}

	async put(path: string, body?: Request): Promise<Response> {
		return this.apiRequest("PUT", path, body);
	}

	async delete(path: string): Promise<Response> {
		return this.apiRequest("DELETE", path);
	}

	private async apiRequest(method: string, path: string, body?: Request): Promise<Response> {
		const res = await fetch(`${BASE_URL}${path}`, {
			method,
			headers: { "Content-Type": "application/json" },
			...(body !== undefined ? { body: JSON.stringify(body) } : {}),
		});
		if (!res.ok) {
			const errorBody = (await res.json().catch(() => ({}))) as { error?: string };
			throw new Error(errorBody.error ?? `Request failed with status ${res.status}`);
		}
		return res.json() as Promise<Response>;
	}
}

export const clientCommunicator = new ClientCommunicator();
