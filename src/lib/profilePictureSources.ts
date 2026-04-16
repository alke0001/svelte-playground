// import.meta.glob is resolved at Vite build time (static map path -> URL).
// We build a folder -> URLs index once when this module loads (not on every $derived tick).
// That is still "runtime" once at startup, but O(1) per lookup; the heavy work is image bytes in the network, not this map.
import defaultProfileImage from "$lib/assets/profile_pictures/default_profileImage.jpg?url";

const allImages = import.meta.glob("$lib/assets/profile_pictures/**/*.{jpg,jpeg,png,webp}", {
	eager: true,
	query: "?url",
	import: "default"
}) as Record<string, string>;

const normalizedEntries = Object.entries(allImages).map(([path, url]) => ({
	path: path.replaceAll("\\", "/"),
	url
}));

const DEFAULT_PROFILE_PICTURE_URL = defaultProfileImage as string;

const MAX_IMAGES = 3;

const PROFILE_MARKER = "/profile_pictures/";

function fileNameFromPath(path: string): string {
	const i = path.lastIndexOf("/");
	return i === -1 ? path : path.slice(i + 1);
}

/** Folder name under profile_pictures, or null for files sitting directly in that root. */
function folderKeyFromPath(path: string): string | null {
	const i = path.indexOf(PROFILE_MARKER);
	if (i === -1) return null;
	const after = path.slice(i + PROFILE_MARKER.length);
	const slash = after.indexOf("/");
	if (slash === -1) return null;
	return after.slice(0, slash);
}

function isDefaultProfileFile(path: string): boolean {
	const base = fileNameFromPath(path).toLowerCase();
	return base === "default_profileimage.jpg";
}

function buildUrlsByFolder(
	entries: { path: string; url: string }[]
): ReadonlyMap<string, readonly string[]> {
	const buckets = new Map<string, { path: string; url: string }[]>();

	for (const entry of entries) {
		if (isDefaultProfileFile(entry.path)) continue;

		const folder = folderKeyFromPath(entry.path);
		if (!folder) continue;

		let list = buckets.get(folder);
		if (!list) {
			list = [];
			buckets.set(folder, list);
		}
		list.push(entry);
	}

	const out = new Map<string, readonly string[]>();

	for (const [folder, list] of buckets) {
		const sorted = [...list].sort((a, b) =>
			fileNameFromPath(a.path).localeCompare(fileNameFromPath(b.path), undefined, {
				sensitivity: "base"
			})
		);
		const urls = sorted.slice(0, MAX_IMAGES).map((m) => m.url);
		out.set(folder, urls);
	}

	return out;
}

const urlsByFolder = buildUrlsByFolder(normalizedEntries);

/**
 * Up to three image URLs for `src/lib/assets/profile_pictures/<folder>/`.
 * Missing folder, empty folder, or no images → `[DEFAULT_PROFILE_PICTURE_URL]`.
 */
export function resolveProfilePictureUrls(pictureFolder: string | undefined): string[] {
	const folder = pictureFolder?.trim();
	if (!folder) {
		return [DEFAULT_PROFILE_PICTURE_URL];
	}

	const urls = urlsByFolder.get(folder);
	if (!urls || urls.length === 0) {
		return [DEFAULT_PROFILE_PICTURE_URL];
	}

	return [...urls];
}

export { DEFAULT_PROFILE_PICTURE_URL };
