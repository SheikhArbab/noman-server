import * as CT from "../types/controllers";
import * as U from "../utils/index";
import { errorHandler } from '../middlewares/errorHandler';
import { Request, Response, NextFunction } from "express";
import Project from "../models/projectSchema";




export const newProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { img, title, url }: CT.Project = req.body;

    try {
        const newProject = new Project({ img, title, url });
        await newProject.save();
        res.status(201).json({ message: 'Project created successfully!', success: true });
    } catch (error) {
        next(error);
    }
};

export const getAllProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const search: string = req.query.search ? String(req.query.search) : "";
        const page: number = req.query.page ? parseInt(String(req.query.page)) - 1 : 0;
        const limit: number = req.query.limit ? parseInt(String(req.query.limit)) : 50;
        let sort: any = req.query.sort || "_id";

        const sortBy = U.buildSortByObject(sort);

        const query: { [key: string]: any } = {
            title: { $regex: search, $options: "i" },
        };

        const projects = await Project.find(query).sort(sortBy).skip(page * limit).limit(limit);
        const totalProjects = await Project.countDocuments(query);
        const pageCount = Math.ceil(totalProjects / limit);

        res.status(200).json({ projects, totalProjects, page: page + 1, limit, pageCount, success: true });
    } catch (error) {
        next(error);
    }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const values: CT.Project = req.body;

    try {
        const existingProject = await Project.findById(id);
        if (!existingProject) {
            return next(errorHandler('Project not found'));
        }

        // Update fields
        const updatedFields: Partial<CT.Project> = {
            img: values.img,
            title: values.title,
            url: values.url,
        };

        const updatedProject = await Project.findByIdAndUpdate(id, updatedFields, { new: true });

        res.status(200).json({ message: 'Project updated successfully!', success: true, project: updatedProject });
    } catch (error) {
        next(error);
    }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const project = await Project.findById(id);
        if (!project) {
            return next(errorHandler('Project not found'));
        }

        res.status(200).json({ project, success: true });
    } catch (error) {
        next(error);
    }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const project = await Project.findById(id);
        if (!project) {
            return next(errorHandler('Project not found'));
        }

        await Project.deleteOne({ _id: id });

        res.status(200).json({ message: 'Project deleted successfully!', success: true });
    } catch (error) {
        next(error);
    }
};
