import { buildApiUrl } from "@/lib/config";

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

interface RequestOptions extends RequestInit {
    token?: string | null;
}

export async function apiRequest<T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const { token, headers, ...rest } = options;

    const response = await fetch(buildApiUrl(path), {
        ...rest,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        let message = `Request failed with status ${response.status}`;
        try {
            const errorData = await response.json();
            message =
                errorData.message || errorData.error || errorData.details || message;
        } catch {
            // Keep fallback message if response body is not JSON.
        }
        throw new ApiError(message, response.status);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return (await response.json()) as T;
}
