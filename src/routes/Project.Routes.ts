import express from "express";
import * as R from '../controllers/ProjectContoller';
import * as A from '../middlewares/authHandler';


const projectRouter = express.Router();

projectRouter.route("/project/get-all").get(R.getAllProjects);
projectRouter.route("/project/create").post(A.isAuthenticated, A.isAuthorized("admin"), R.newProject);
projectRouter.route("/project/update/:id").put(A.isAuthenticated, A.isAuthorized("admin"), R.updateProject);
projectRouter.route("/project/delete/:id").delete(A.isAuthenticated, A.isAuthorized("admin"), R.deleteProject);

export default projectRouter;