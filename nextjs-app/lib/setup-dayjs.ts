import "dayjs/locale/de";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

// https://day.js.org/docs/en/plugin/timezone#docsNav
dayjs.extend(utc);
dayjs.extend(timezone);
