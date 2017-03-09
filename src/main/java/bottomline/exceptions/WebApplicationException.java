package bottomline.exceptions;

import org.springframework.http.HttpStatus;

/**
 * Created by raft on 09.03.2017.
 */

public class WebApplicationException extends RuntimeException {
    private static final long serialVersionUID = 5483169307817809054L;
    String msg;
    HttpStatus status;

    public WebApplicationException(String msg, HttpStatus status) {
        this.msg = msg;
        this.status = status;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }
}
