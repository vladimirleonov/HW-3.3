import app from "../src/app";
import {agent} from "supertest";
import TestAgent = require("supertest/lib/agent");
import { Test } from 'supertest';

export const req: TestAgent<Test> = agent(app)