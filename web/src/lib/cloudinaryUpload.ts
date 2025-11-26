//src\lib\cloudinaryUpload.ts

const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dheumdmvn";

const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "furniture_unsigned";
  
if (!CLOUD_NAME) {
  console.warn(
    "[cloudinaryUpload] CLOUD_NAME ცარიელია. შეამოწმე NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ან კონსტანტა ფაილში.",
  );
}

if (!UPLOAD_PRESET) {
  console.warn(
    "[cloudinaryUpload] UPLOAD_PRESET ცარიელია. შექმენი unsigned upload preset Cloudinary-ში.",
  );
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary კონფიგურაცია არ არის სრულად გამართული");
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Cloudinary upload error:", res.status, text);
    throw new Error("Cloudinary-ზე ატვირთვა ვერ მოხერხდა");
  }

  const data = (await res.json()) as {
    secure_url?: string;
    url?: string;
    [key: string]: unknown;
  };

  if (!data.secure_url && !data.url) {
    console.error("Cloudinary response without url:", data);
    throw new Error("Cloudinary-ს პასუხში ვერ ვიპოვე სურათის URL");
  }

  // prefer secure_url
  return (data.secure_url || data.url)!;
}
