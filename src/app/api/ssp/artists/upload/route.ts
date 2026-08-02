import { NextRequest, NextResponse } from "next/server";
import { mkdir, readdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { verifyPanelPassword } from "@/lib/panelAuth";

export const runtime = "nodejs";

const artistPhotosDir = path.join(process.cwd(), "public", "photos", "artists");

const extensionByMimeType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

function resolvePhotoExtension(file: File): string {
  const extensionFromName = path.extname(file.name).replace(".", "").toLowerCase();
  if (extensionFromName) return extensionFromName;
  return extensionByMimeType[file.type] ?? "jpg";
}

async function removeExistingArtistPhotos(artistId: number) {
  let existingFileNames: string[] = [];
  try {
    existingFileNames = await readdir(artistPhotosDir);
  } catch {
    return;
  }

  const staleFileNames = existingFileNames.filter((fileName) =>
    fileName.startsWith(`artist-${artistId}.`),
  );

  await Promise.all(
    staleFileNames.map((fileName) => unlink(path.join(artistPhotosDir, fileName))),
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const password = String(formData.get("password") ?? "");
    const valid = await verifyPanelPassword(password);
    if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const artistId = Number(formData.get("id"));
    if (!artistId) return NextResponse.json({ error: "Missing artist id" }, { status: 400 });

    const photoFile = formData.get("file");
    if (!(photoFile instanceof File) || photoFile.size === 0) {
      return NextResponse.json({ error: "No photo file received" }, { status: 400 });
    }

    const photoExtension = resolvePhotoExtension(photoFile);
    const photoFileName = `artist-${artistId}.${photoExtension}`;

    await mkdir(artistPhotosDir, { recursive: true });
    await removeExistingArtistPhotos(artistId);

    const photoBytes = Buffer.from(await photoFile.arrayBuffer());
    await writeFile(path.join(artistPhotosDir, photoFileName), photoBytes);

    return NextResponse.json({ photoUrl: `photos/artists/${photoFileName}` });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
