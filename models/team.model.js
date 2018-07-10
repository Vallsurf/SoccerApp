
const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    formation: {
        Forward1: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        Forward2: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        Midfield1: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        Midfield2: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        Defense1: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        Defense2: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        Utility: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        Goalie: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    },
    //
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

},
{
    timestamps: true,
});

const Team = mongoose.model('Team', teamSchema);

module.exports = { Team };
