package com.study.study.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final Resend resend;
    private final String fromAddress = "study@maindan.tech";
    public String sendEmail(String to, String subject, String body) throws ResendException {

        String html = emailTemplate(body);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(fromAddress)
                .to(to)
                .subject(subject)
                .html(html)
                .build();

        var response = resend.emails().send(params);
        return response.getId();
    }


    public String emailTemplate(String body) {
        return """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f5f5f5;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 30px auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            padding: 20px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        h1 {
                            color: #333333;
                            font-size: 22px;
                        }
                        p {
                            color: #555555;
                            font-size: 16px;
                            line-height: 1.5;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 13px;
                            color: #999999;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Study - Notificação</h1>
                        <p>%s</p>
                        <div class="footer">
                            <p>© 2025 Study | Enviado automaticamente por Resend</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(body);
    }
}
