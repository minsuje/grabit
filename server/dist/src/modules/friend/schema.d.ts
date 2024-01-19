export declare const friend: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "friend";
    schema: undefined;
    columns: {
        friend_id: import("drizzle-orm/pg-core").PgColumn<{
            name: "friend_num";
            tableName: "friend";
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
            tableName: "friend";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        other_userid_num: import("drizzle-orm/pg-core").PgColumn<{
            name: "friend_userid_num";
            tableName: "friend";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        is_friend: import("drizzle-orm/pg-core").PgColumn<{
            name: "is_friend";
            tableName: "friend";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        created_at: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "friend";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        updated_at: import("drizzle-orm/pg-core").PgColumn<{
            name: "updated_at";
            tableName: "friend";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const friendRelations: import("drizzle-orm").Relations<"users", {
    user: import("drizzle-orm").Many<"friend">;
}>;
