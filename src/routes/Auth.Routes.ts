import express from "express";
import * as R from '../controllers/AuthContoller';
import * as A from '../middlewares/authHandler';


const authRouter = express.Router();

authRouter.route("/auth/sign-up").post(R.signUp);
authRouter.route("/auth/sign-in").post(R.signIn);
authRouter.route("/auth/admin/get-all").get(A.isAuthenticated, A.isAuthorized("admin"), R.getAll);
authRouter.route("/auth/admin/get/:id").get(A.isAuthenticated, A.isAuthorized("admin"), R.byId);
authRouter.route("/auth/account-delete/:id")
    .delete(A.isAuthenticated, A.isAuthorized("admin"), R.deleteAcc);
authRouter.route("/auth/account-update/:id").put(A.isAuthenticated, A.isAuthorized("admin", "user"), R.update);

export default authRouter;