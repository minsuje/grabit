"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const schema_1 = require("./schema");
const db_1 = require("../../../db/db");
let UserService = class UserService {
    constructor() {
        this.createNewUser = async (login_type, createUserDto) => {
            const { userid, social_userid, password, name, nickname, profile_img, score_num, money } = createUserDto;
            const userInfo = {
                login_type: login_type,
                userid: userid,
                social_userid: social_userid,
                password: password,
                name: name,
                nickname: nickname,
                profile_img: profile_img,
                score_num: score_num,
                money: money,
            };
            return await db_1.db.insert(schema_1.users).values(userInfo);
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map