package bottomline.controller;

import bottomline.exceptions.WebApplicationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by raft on 09.03.2017.
 */
@ControllerAdvice
@RestController
public class WebApplicationExceptionHandler {
    @ExceptionHandler(value = WebApplicationException.class)
    public ResponseEntity<String> handleWebApplicationException(WebApplicationException e) {
        ResponseEntity<String> response = new ResponseEntity<String>(e.getMsg(), e.getStatus());
        return response;
    }
}
