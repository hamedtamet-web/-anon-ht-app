import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class ModerationManager {
    private static final Set<String> forbiddenWords = new HashSet<>();

    static {
        // تحميل الملفات من المجلد bad_words الذي أنشأته
        String[] languages = {"ar.txt", "en.txt", "fr.txt"};
        for (String langFile : languages) {
            loadWords("bad_words/" + langFile);
        }
    }

    private static void loadWords(String filePath) {
        try (InputStream is = ModerationManager.class.getClassLoader().getResourceAsStream(filePath)) {
            if (is != null) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
                String line;
                while ((line = reader.readLine()) != null) {
                    String word = line.trim().toLowerCase();
                    if (!word.isEmpty()) {
                        forbiddenWords.add(word);
                    }
                }
            }
        } catch (IOException e) {
            System.err.println("خطأ في تحميل ملف: " + filePath);
        }
    }

    /**
     * هذه الدالة تأخذ النص الأصلي وترجع نصاً "نظيفاً"
     * تستبدل الكلمات المحظورة بـ ****
     */
    public static String cleanContent(String text) {
        if (text == null || text.isEmpty()) return text;

        String result = text;
        String lowerText = text.toLowerCase();

        for (String badWord : forbiddenWords) {
            // نستخدم ميزة التبديل مع تجاهل حالة الأحرف
            // (?i) تعني Case-Insensitive لضمان صيد الكلمات بكل أشكالها
            if (lowerText.contains(badWord.toLowerCase())) {
                result = result.replaceAll("(?i)" + badWord, "****");
            }
        }
        return result;
    }

    /**
     * دالة اختيارية إذا قررت حظر المستخدم لاحقاً
     */
    public static void banUser(String userId) {
        System.out.println("User " + userId + " has been flagged for profanity.");
        // هنا تضع كود قاعدة البيانات للحظر الفعلي
    }
}
