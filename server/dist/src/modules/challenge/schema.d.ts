export declare const challenge: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "challenge";
    schema: undefined;
    columns: {
        challenge_id: import("drizzle-orm/pg-core").PgColumn<{
            name: "challenge_id";
            tableName: "challenge";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        userid_num: import("drizzle-orm/pg-core").PgColumn<{
            name: "userid_num";
            tableName: "challenge";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        challenge_name: import("drizzle-orm/pg-core").PgColumn<{
            name: "challenge_name";
            tableName: "challenge";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        topic: import("drizzle-orm/pg-core").PgColumn<{
            name: "topic";
            tableName: "challenge";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        challenger_userid_num: import("drizzle-orm/pg-core").PgColumn<{
            name: "challenger_userid_num";
            tableName: "challenge";
            dataType: "array";
            columnType: "PgArray";
            data: number[];
            driverParam: string | (string | number)[];
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: import("drizzle-orm").Column<{
                name: "challenger_userid_num";
                tableName: "challenge";
                dataType: "number";
                columnType: "PgInteger";
                data: number;
                driverParam: string | number;
                notNull: false;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object, object>;
        }, {}, {}>;
        goal_money: import("drizzle-orm/pg-core").PgColumn<{
            name: "goal_money";
            tableName: "challenge";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        deadline: import("drizzle-orm/pg-core").PgColumn<{
            name: "deadline";
            tableName: "challenge";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        winner_userid_num: import("drizzle-orm/pg-core").PgColumn<{
            name: "winner_userid_num";
            tableName: "challenge";
            dataType: "array";
            columnType: "PgArray";
            data: number[];
            driverParam: string | (string | number)[];
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: import("drizzle-orm").Column<{
                name: "winner_userid_num";
                tableName: "challenge";
                dataType: "number";
                columnType: "PgInteger";
                data: number;
                driverParam: string | number;
                notNull: false;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object, object>;
        }, {}, {}>;
        authentication_term: import("drizzle-orm/pg-core").PgColumn<{
            name: "authentication_term";
            tableName: "challenge";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        authentication_time: import("drizzle-orm/pg-core").PgColumn<{
            name: "authentication_time";
            tableName: "challenge";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const challengeRelations: import("drizzle-orm").Relations<"users", {
    posts: import("drizzle-orm").Many<"challenge">;
}>;
export declare const authentication: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "authentication";
    schema: undefined;
    columns: {
        authentication_id: import("drizzle-orm/pg-core").PgColumn<{
            name: "authentication_id";
            tableName: "authentication";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        challenge_id: import("drizzle-orm/pg-core").PgColumn<{
            name: "challenge_id";
            tableName: "authentication";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        created_at: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "authentication";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        userid_num: import("drizzle-orm/pg-core").PgColumn<{
            name: "userid_num";
            tableName: "authentication";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        authentication_img: import("drizzle-orm/pg-core").PgColumn<{
            name: "authentication_img";
            tableName: "authentication";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const authenticationRelations: import("drizzle-orm").Relations<"challenge", {
    posts: import("drizzle-orm").Many<"authentication">;
}>;
export declare const authentication_img_emoticon: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "authentication_img_emoticon";
    schema: undefined;
    columns: {
        authentication_img_emoticon_id: import("drizzle-orm/pg-core").PgColumn<{
            name: "authentication_img_emoticon_id";
            tableName: "authentication_img_emoticon";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        authentication_id: import("drizzle-orm/pg-core").PgColumn<{
            name: "authentication_id";
            tableName: "authentication_img_emoticon";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        authentication_img_comment_userid_num: import("drizzle-orm/pg-core").PgColumn<{
            name: "authentication_img_comment_userid_num";
            tableName: "authentication_img_emoticon";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        authentication_img_comment_emoticon: import("drizzle-orm/pg-core").PgColumn<{
            name: "authentication_img_comment_emoticon";
            tableName: "authentication_img_emoticon";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const authenticationEmoticonRelations: import("drizzle-orm").Relations<"authentication", {
    posts: import("drizzle-orm").Many<"authentication_img_emoticon">;
}>;