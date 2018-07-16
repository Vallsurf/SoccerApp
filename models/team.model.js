
const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    formation: {
        Player1: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        Player2: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        Player3: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        Player4: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        Player5: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        Player6: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        Player7: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        Player8: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    },
    //
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

},
{
    timestamps: true,
});

const Team = mongoose.model('Team', teamSchema);

module.exports = { Team };
