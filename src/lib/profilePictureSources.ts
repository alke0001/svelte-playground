// import.meta.glob is resolved at Vite build time (static map path -> URL).
// We build a folder -> slides index once when this module loads (not on every $derived tick).
// Captions come from the source file name (Vite output URLs may not keep the original name).
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

export type ProfilePictureSlide = {
	readonly url: string;
	readonly caption: string;
};

function fileNameFromPath(path: string): string {
	const i = path.lastIndexOf("/");
	return i === -1 ? path : path.slice(i + 1);
}

/** Human label: drop extension, turn underscores into spaces (e.g. Ich_Privat_ganz_lässig.jpg). */
export function captionFromFileName(fileName: string): string {
	const noExt = fileName.replace(/\.(jpe?g|png|webp)$/i, "");
	return noExt.replaceAll("_", " ");
}

function captionFromSourcePath(path: string): string {
	return captionFromFileName(fileNameFromPath(path));
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

function buildSlidesByFolder(
	entries: { path: string; url: string }[]
): ReadonlyMap<string, readonly ProfilePictureSlide[]> {
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

	const out = new Map<string, readonly ProfilePictureSlide[]>();

	for (const [folder, list] of buckets) {
		const sorted = [...list].sort((a, b) =>
			fileNameFromPath(a.path).localeCompare(fileNameFromPath(b.path), undefined, {
				sensitivity: "base"
			})
		);
		const slides: ProfilePictureSlide[] = sorted.slice(0, MAX_IMAGES).map((m) => ({
			url: m.url,
			caption: captionFromSourcePath(m.path)
		}));
		out.set(folder, slides);
	}

	return out;
}

const slidesByFolder = buildSlidesByFolder(normalizedEntries);

const DEFAULT_SLIDE: ProfilePictureSlide = {
	url: DEFAULT_PROFILE_PICTURE_URL,
	caption: captionFromFileName("default_profileImage.jpg")
};

/**
 * Up to three slides for `src/lib/assets/profile_pictures/<folder>/`.
 * Missing folder, empty folder, or no images → default slide only.
 */
export function resolveProfilePictureSlides(
	pictureFolder: string | undefined
): ProfilePictureSlide[] {
	const folder = pictureFolder?.trim();
	if (!folder) {
		return [DEFAULT_SLIDE];
	}

	const slides = slidesByFolder.get(folder);
	if (!slides || slides.length === 0) {
		return [DEFAULT_SLIDE];
	}

	return [...slides];
}

export { DEFAULT_PROFILE_PICTURE_URL };
