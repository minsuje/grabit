"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeCreateService = void 0;
const common_1 = require("@nestjs/common");
const schema_1 = require("./schema");
const db_1 = require("../../../db/db");
let ChallengeCreateService = class ChallengeCreateService {
    constructor() {
        this.newChallenge = async (body) => {
            const { challenge_name, topic, challenger_userid_num, goal_money, deadline, authentication_term, authentication_time, } = body;
            console.log(goal_money);
            return await db_1.db.insert(schema_1.challenge).values({
                challenge_name: challenge_name,
                topic: topic,
                challenger_userid_num: challenger_userid_num,
                goal_money: goal_money,
                deadline: deadline,
                authentication_term: authentication_term,
                authentication_time: authentication_time,
            });
        };
    }
};
exports.ChallengeCreateService = ChallengeCreateService;
exports.ChallengeCreateService = ChallengeCreateService = __decorate([
    (0, common_1.Injectable)()
], ChallengeCreateService);
//# sourceMappingURL=challenge.service.js.map