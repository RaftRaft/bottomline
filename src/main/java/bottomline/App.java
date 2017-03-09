package bottomline;

import bottomline.exceptions.CustomAsyncExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

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
//          GCM_SERVER_KEY = props.getProperty("gcm.server.key").trim();
//          LOG.info("Loaded GCM SERVER KEY = {} property", GCM_SERVER_KEY);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
