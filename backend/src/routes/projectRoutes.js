import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  archiveProject,
  joinProject,
  leaveProject,
  inviteDeveloper,
  acceptInvite,
  addComment,
  deleteComment,
  uploadFile,
  deleteFile,
} from '../controllers/projectController.js';
import {
  createProjectValidation,
  updateProjectValidation,
  projectIdValidation,
  searchProjectsValidation,
  addCommentValidation,
  inviteDeveloperValidation,
} from '../validations/projectValidation.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|zip|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  },
});

// Public routes
router.get('/search', protect, searchProjectsValidation, validateRequest, getProjects);

// Project CRUD
router.route('/')
  .post(protect, createProjectValidation, validateRequest, createProject)
  .get(protect, searchProjectsValidation, validateRequest, getProjects);

router.route('/:id')
  .get(protect, projectIdValidation, validateRequest, getProjectById)
  .put(protect, projectIdValidation, updateProjectValidation, validateRequest, updateProject)
  .delete(protect, projectIdValidation, validateRequest, deleteProject);

// Archive project
router.patch('/:id/archive', protect, projectIdValidation, validateRequest, archiveProject);

// Join/Leave project
router.post('/:id/join', protect, projectIdValidation, validateRequest, joinProject);
router.post('/:id/leave', protect, projectIdValidation, validateRequest, leaveProject);

// Invites
router.post('/:id/invite', protect, projectIdValidation, inviteDeveloperValidation, validateRequest, inviteDeveloper);
router.post('/:id/accept-invite/:token', protect, projectIdValidation, validateRequest, acceptInvite);

// Comments
router.post('/:id/comments', protect, projectIdValidation, addCommentValidation, validateRequest, addComment);
router.delete('/:id/comments/:commentId', protect, projectIdValidation, validateRequest, deleteComment);

// Files
router.post('/:id/files', protect, projectIdValidation, upload.single('file'), uploadFile);
router.delete('/:id/files/:fileId', protect, projectIdValidation, validateRequest, deleteFile);

export default router;
