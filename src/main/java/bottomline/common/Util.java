package bottomline.common;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by raft on 01.04.2017.
 */
public class Util {

    public static final String DATE_FORMAT = "dd/MM/yyyy";

    public static long getDateWithoutTime(long dateInMillis) throws ParseException {
        DateFormat formatter = new SimpleDateFormat(DATE_FORMAT);
        Date date = new Date(dateInMillis);
        return formatter.parse(formatter.format(date)).getTime();
    }
}
