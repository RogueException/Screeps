"use strict";
var listUtils = require('util.list');
var mapUtils = require('util.map');
var partUtils = require('util.parts');

const CORE_PARTS = [TOUGH,HEAL,MOVE,MOVE];
const REPEAT_PARTS = [];

module.exports.getBodyInfo = function(energy) {
    return partUtils.get(CORE_PARTS, REPEAT_PARTS, energy);
}

module.exports.onCreate = function(name, memory) {
    if (memory.squad)
        listUtils.add(Memory.military.squads[memory.squad].creeps, name);
}

module.exports.onDestroy = function(name, memory) {
    if (memory.squad)
        listUtils.remove(Memory.military.squads[memory.squad].creeps, name);
}

module.exports.update = function(creep, memory, actions) {
    if (memory.room && creep.pos.roomName !== memory.room) {
        var pos = creep.pos.findClosestByPath(creep.room.findExitTo(memory.room));
        if (pos) {
            actions.moveTo(creep, pos, true);
            return;
        }
    }
    var roomMemory = Memory.rooms[memory.room];
    if (roomMemory) {
        var unit = mapUtils.findClosestCreepByPath(creep.pos, roomMemory.units, x => {
            return x.hits < x.hitsMax;
        });
        if (unit) {
            actions.heal(creep, unit, true);
            actions.rangedHeal(creep, unit, false);
        }
    }
}