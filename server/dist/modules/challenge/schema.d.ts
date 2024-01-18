export declare const challenge: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "challenge";
    schema: undefined;
    columns: {
        challenge_num: import("drizzle-orm/pg-core").PgColumn<{
            name: "challenge_num";
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
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        goalMoney: import("drizzle-orm/pg-core").PgColumn<{
            name: "goalMoney";
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
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
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
export declare const authentication: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "authentication";
    schema: undefined;
    columns: {
        authentication_img_emoticon_id: import("drizzle-orm/pg-core").PgColumn<{
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
        challenge_num: import("drizzle-orm/pg-core").PgColumn<{
            name: "challenge_num";
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
export declare const challengeRelations: import("drizzle-orm").Relations<"challenge", {
    authentication: import("drizzle-orm").One<"challenge", false>;
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
