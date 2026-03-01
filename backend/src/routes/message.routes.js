import { Router } from "express";
import { getMessage, listMessages } from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.route("/").get(listMessages);
messageRouter.route("/:id").get(getMessage);

export default messageRouter;
