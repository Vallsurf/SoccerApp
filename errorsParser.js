
const parseErrors = errors => Object.keys(errors).map(item => errors[item].message);

module.exports = {
    generateErrorResponse: (report) => {
        console.log(report);
        if (report.errors && report._message) {
            return {
                generalMessage: report._message,
                messages: parseErrors(report.errors),
            };
        }

        if (report.reason === 'ValidationError') {
            console.log(report);
            return {
                message: parseErrors(report.errors),
            };
        }

        return {
            generalMessage: 'Something went wrong, please contact API admin',
        };
    },
};
