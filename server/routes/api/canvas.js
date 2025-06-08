import express from 'express';
import canvasService from '../../services/canvasService.js';
import logger from '../../configs/logger.js';

const router = express.Router();
/**
 * @swagger
 * /courses/progress:
 *   get:
 *     summary: Retrieve course progress for the teacher in the specified course
 *     description: Fetches the list of courses from the Canvas API.
 *     responses:
 *       200:
 *         description: Successfully retrieved courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized - Canvas API is not configured
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       503:
 *         description: Service unavailable - Failed to get courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/courses/progress/:course_id/:teacher_id', async function (req, res){
    const teacherID = req.params.teacher_id;
    const courseID = req.params.course_id;

    logger.log('info', 'Requested course progress for course ' + courseID + ' and teacher ' + teacherID);

    const response = await canvasService.getCourseProgress(courseID, teacherID);

    
    
    if(response.status === 200){
        res.json(response.data);
    }
    else if(response.status === 401){
        res.status(401).json({message: 'Canvas API is not configured.'});
    }
    else{
        res.status(503).json({message: 'Failed to get courses (check api connection?)'});
        logger.error('Failed to get courses');
    }

    return response;
})

/**
 * @swagger
 * /courses/enrollment:
 * post:
 *      summary: Enrolls a teacher in to a course, based off of teacher ID and course ID. 
 */
router.post('/courses/enrollment/:course_id/:teacher_id', async function (req, res){
    const teacherID = req.params.teacher_id;
    const courseID = req.params.course_id;

    logger.log('info', 'Requested course enrollment for teacher ' + teacherID + ' in to course ' + courseID);

    const response = await canvasService.enrollTeacherInCourse(courseID, teacherID);
})

export default router;