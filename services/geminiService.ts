
import { GoogleGenAI } from "@google/genai";
import { ThumbnailConfig, PrimaryMode } from "../types";

export const generateThumbnail = async (
  config: ThumbnailConfig, 
  refineMode: boolean = false, 
  textEditMode: boolean = false
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const isAuto = config.primaryMode === PrimaryMode.AUTO;
  const isPrimary = config.primaryMode !== PrimaryMode.DISABLED;

  const engineLogic = isAuto ? `
    PRIMARY ENGINE: AUTO MODE ENABLED
    - Tối ưu hóa phân cấp thị giác tự động.
    - Tăng cường CTR bằng AI.
    - Cân bằng trắng và ánh sáng thông minh.
  ` : isPrimary ? `
    PRIMARY ENGINE: ENABLED
    - Ưu tiên thương hiệu và độ rõ nét.
    - Tuân thủ nghiêm ngặt các module chiến lược.
  ` : `
    PRIMARY ENGINE: DISABLED
    - Điều khiển thủ công hoàn toàn.
  `;

  const strategyInstructions = `
    CHIẾN LƯỢC:
    - Độ rõ: ${config.strategy.clarity}
    - Tương phản: ${config.strategy.contrast}
    - Tiêu điểm: ${config.strategy.focus}
    - Di động: ${config.strategy.mobile}
  `;

  const layoutMapping: Record<string, string> = {
    'left-text': 'BỐ CỤC: Đối tượng bên phải, Văn bản bên trái.',
    'right-text': 'BỐ CỤC: Đối tượng bên trái, Văn bản bên phải.',
    'center': 'BỐ CỤC: Trung tâm hùng tráng.',
    'minimal': 'BỐ CỤC: Tối giản sạch sẽ.',
    'split': 'BỐ CỤC: Chia đôi màn hình A/B.',
    'dark-vibe': 'BỐ CỤC: Điện ảnh bí ẩn tối.'
  };

  const vietnameseFix = `
    LƯU Ý QUAN TRỌNG VỀ TIẾNG VIỆT:
    - Văn bản: "${config.text.toUpperCase()}"
    - Hãy đảm bảo các dấu câu (huyền, sắc, hỏi, ngã, nặng) và các ký tự đặc biệt (đ, â, ê, ô, ư, ơ) được vẽ CHÍNH XÁC.
    - KHÔNG thêm các ký tự lạ hoặc ký hiệu nhiễu vào trong chữ.
    - Font chữ phải dày (Bold), không chân (Sans-serif), hiện đại và có độ tương phản cực cao.
  `;

  let prompt = "";
  
  if (textEditMode) {
    prompt = `
      NHIỆM VỤ: SỬA LỖI VÀ CẬP NHẬT VĂN BẢN TRÊN ẢNH HIỆN TẠI.
      HÃY GIỮ NGUYÊN ĐỐI TƯỢNG, NỀN VÀ BỐ CỤC.
      CHỈ THAY THẾ VÙNG CHỨA CHỮ BẰNG VĂN BẢN MỚI: "${config.text.toUpperCase()}"
      ${vietnameseFix}
      - Yêu cầu chữ sạch sẽ, viền (outline) rõ ràng, bóng đổ mạnh để tách khỏi nền.
      - Sửa các lỗi biến dạng chữ từ ảnh gốc nếu có.
    `;
  } else {
    prompt = `
      Tạo Thumbnail YouTube chuyên nghiệp (1280x720).
      VĂN BẢN CHÍNH: "${config.text.toUpperCase()}"
      ĐỐI TƯỢNG: ${config.subjectDescription}
      TÔNG MÀU: ${config.tone}
      
      ${vietnameseFix}
      ${engineLogic}
      ${layoutMapping[config.layoutPresetId] || ''}
      ${strategyInstructions}
      ${config.primaryMode === PrimaryMode.ENABLED ? `MÀU CHỦ ĐẠO: ${config.primaryColor}` : ''}
      
      YÊU CẦU QUAN TRỌNG: Tỉ lệ 16:9. Khuôn mặt rõ ràng. Văn bản chiếm 30-40% diện tích ảnh để tối ưu di động.
    `;
  }

  const model = 'gemini-2.5-flash-image';
  
  const contents = config.referenceImage ? {
    parts: [
      { inlineData: { data: config.referenceImage.split(',')[1] || config.referenceImage, mimeType: 'image/png' } },
      { text: prompt }
    ]
  } : {
    parts: [{ text: prompt }]
  };

  try {
    const result = await ai.models.generateContent({
      model,
      contents,
      config: { 
        imageConfig: { 
          aspectRatio: "16:9"
        } 
      }
    });

    const candidate = result.candidates?.[0];
    if (!candidate || !candidate.content?.parts) {
      throw new Error("Không nhận được phản hồi từ AI.");
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("AI trả về văn bản nhưng không có ảnh. Có thể do bộ lọc an toàn.");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};
