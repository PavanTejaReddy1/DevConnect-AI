import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  reorderTasks,
  addComment,
  deleteComment,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  uploadAttachment,
  deleteAttachment,
} from '../controllers/taskController.js';
import {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
  searchTasksValidation,
  addCommentValidation,
  addChecklistItemValidation,
  updateChecklistItemValidation,
  reorderTasksValidation,
} from '../validations/taskValidation.js';

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

// Task CRUD
router.route('/')
  .post(protect, createTaskValidation, validateRequest, createTask)
  .get(protect, searchTasksValidation, validateRequest, getTasks);

router.route('/:id')
  .get(protect, taskIdValidation, validateRequest, getTaskById)
  .put(protect, taskIdValidation, updateTaskValidation, validateRequest, updateTask)
  .delete(protect, taskIdValidation, validateRequest, deleteTask);

// Reorder tasks (drag-drop)
router.put('/reorder', protect, reorderTasksValidation, validateRequest, reorderTasks);

// Comments
router.post('/:id/comments', protect, taskIdValidation, addCommentValidation, validateRequest, addComment);
router.delete('/:id/comments/:commentId', protect, taskIdValidation, validateRequest, deleteComment);

// Checklist
router.post('/:id/checklist', protect, taskIdValidation, addChecklistItemValidation, validateRequest, addChecklistItem);
router.put('/:id/checklist/:itemId', protect, taskIdValidation, updateChecklistItemValidation, validateRequest, updateChecklistItem);
router.delete('/:id/checklist/:itemId', protect, taskIdValidation, validateRequest, deleteChecklistItem);

// Attachments
router.post('/:id/attachments', protect, taskIdValidation, upload.single('file'), uploadAttachment);
router.delete('/:id/attachments/:attachmentId', protect, taskIdValidation, validateRequest, deleteAttachment);

export default router;
