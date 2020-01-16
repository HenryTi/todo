import { Tuid, Map, Query, Action, Sheet } from "tonva";

export interface Performance {
    TestExpression: Action;
    RoleScoreItem: Map;
    getRoleScoreItem: Query;
    ScoreItem: Tuid;
    ParameterConfiguration: Tuid;
    UpateRoleScoreItem: Action;
}

export interface HR {
    Role: Tuid;
}

export interface UQs {
    performance: Performance
    hr: HR
}
