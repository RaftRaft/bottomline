package bottomline;

import bottomline.exceptions.CustomAsyncExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Properties;
import java.util.concurrent.Executor;


/**
 * Created by raft on 09.03.2017.
 */
@Configuration
@SpringBootApplication
@EnableScheduling
@EnableAsync
public class App implements AsyncConfigurer {
    private static final Logger LOG = LoggerFactory.getLogger(App.class);

    public static String SMTP_HOST;
    public static String SMTP_PORT;
    public static String SMTP_USER;
    public static String SMTP_PWD;
    public static String INVITATION_BASE_URL;

    public static void main(String[] args) {
        loadAppProps();
        SpringApplication.run(App.class, args);
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return new CustomAsyncExceptionHandler();
    }

    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
        taskExecutor.setCorePoolSize(30);
        taskExecutor.setThreadNamePrefix("ProcExecutor-");
        taskExecutor.initialize();
        return taskExecutor;
    }

    private static void loadAppProps() {
        Properties props = new Properties();
        try {
            props.load(App.class.getClassLoader().getResourceAsStream(("application.properties")));
            SMTP_HOST = props.getProperty("smtp.host").trim();
            SMTP_PORT = props.getProperty("smtp.port").trim();
            SMTP_USER = props.getProperty("smtp.user").trim();
            SMTP_PWD = props.getProperty("smtp.pwd").trim();
            INVITATION_BASE_URL = props.getProperty("invitation.base.url").trim();
            LOG.info("Loaded SMTP HOST = {} property", SMTP_HOST);
            LOG.info("Loaded SMTP PORT = {} property", SMTP_PORT);
            LOG.info("Loaded SMTP USER = {} property", SMTP_USER);
            LOG.info("Loaded INVITATION BASE URL = {} property", INVITATION_BASE_URL);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
