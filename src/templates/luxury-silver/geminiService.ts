import { GoogleGenAI } from "@google/genai";

// IMPORTANT: In a real Vite app, you'd use import.meta.env.VITE_GEMINI_API_KEY
// For this environment, we use process.env.API_KEY as required.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("API key not configured");
}

const ai = new GoogleGenAI({ apiKey });

export const generateIslamicWeddingPrayer = async (): Promise<string> => {
 const prompt = `
Tugas Anda adalah menghasilkan kutipan ayat Al-Qur'an atau doa Nabi tentang pernikahan dengan format yang sangat spesifik.

Pilih salah satu dari referensi berikut:
- Q.S. Ar-Rum ayat 21
- Al-Qur’an Surat Yasiin (36:36)
- Al-Qur’an Surat Adz-Dzariyyat (51:49)
- Q.S. An-Nisa ayat 1
- Q.S An-Nur ayat 32
- Q.S An-Nahl ayat 72
- Hadits Riwayat Bukhari dan Muslim
- Doa Nabi Muhammad SAW saat pernikahan putrinya Fatimah Az Zahra dengan Ali bin Abi Thalib.

Hasilkan teks HANYA dalam format berikut, tanpa teks tambahan atau pembuka/penutup, menggunakan salah satu referensi di atas. hasil selanjutnya berbeda dari sebelumnya, Contoh ini menggunakan Q.S. Ar-Rum ayat 21:

Al-Qur’an Surat Ar-Ruum (30:21)

“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir.”
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating Islamic wedding prayer:", error);
    return "Maaf, terjadi kesalahan saat menyusun doa pernikahan. Silakan coba lagi.";
  }
};