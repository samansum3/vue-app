import moment from 'moment/min/moment.min';

const DateFormater = {
    methods: {
        timestampToString: function (timestamp, format = 'DD MMM YYYY') {
            return timestamp ? moment(parseInt(timestamp, 10)).format(format) : '';
        }
    }
}

export default DateFormater;