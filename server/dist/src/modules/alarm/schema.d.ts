export declare const alarm: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "alarm";
    schema: undefined;
    columns: {
        alarm_id: import("drizzle-orm/pg-core").PgColumn<{
            name: "alarm_id";
            tableName: "alarm";
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
            tableName: "alarm";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        challenge_num: import("drizzle-orm/pg-core").PgColumn<{
            name: "challenge_num";
            tableName: "alarm";
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
