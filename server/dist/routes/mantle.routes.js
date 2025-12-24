"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const mantle_controller_1 = require("../controllers/mantle.controller");
exports.router = (0, express_1.Router)();
exports.router.get("/mantle/tokens", mantle_controller_1.getMantleTokens);
//# sourceMappingURL=mantle.routes.js.map