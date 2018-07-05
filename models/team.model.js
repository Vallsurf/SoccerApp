
const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    formation: {
        Forward1: String,
        Forward2: String,
        Midfield1: String,
        Midfield2: String,
        Defense1: String,
        Defense2: String,
        Utility: String,
        Goalie: String,
    },

    userowner: {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    },
},
{
    timestamps: true,
});

const Team = mongoose.model('Team', teamSchema);

module.exports = { Team };
