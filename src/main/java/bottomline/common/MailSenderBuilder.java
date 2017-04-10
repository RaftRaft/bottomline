package bottomline.common;

import bottomline.App;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

/**
 * Created by raft on 10.04.2017.
 */
public class MailSenderBuilder {

    private static final Logger LOG = LogManager.getLogger(MailSenderBuilder.class);

    private Properties properties;
    private String from;
    private String subject;
    private Set<String> recipients = new HashSet<>();

    public MailSenderBuilder() {
        properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.setProperty("mail.smtp.host", App.SMTP_HOST);
        properties.setProperty("mail.smtp.port", App.SMTP_PORT);
    }

    public MailSenderBuilder recipient(String recipient) {
        this.recipients.add(recipient);
        return this;
    }

    public MailSenderBuilder subject(String subject) {
        this.subject = subject;
        return this;
    }

    public MailSenderBuilder from(String from) {
        this.from = from;
        return this;
    }

    public MailSenderBuilder build() {
        return this;
    }

    public boolean send(String msg) {
        Session session = Session.getDefaultInstance(properties, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(App.SMTP_USER, App.SMTP_PWD);
            }
        });
        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            for (String recipient : recipients) {
                message.addRecipient(Message.RecipientType.TO, new InternetAddress(recipient));
            }
            message.setSubject(subject);
            message.setText(msg);
            Transport.send(message);
            LOG.info("Sent mail successfully to recipients");
            return true;
        } catch (MessagingException mex) {
            mex.printStackTrace();
        }
        return false;
    }
}