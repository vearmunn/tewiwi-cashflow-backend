import express from 'express';
import * as cashObligationController from '../controllers/cash_obligation_controller.js';
import authenticate from '../middlewares/authenticate.js'
import validate from '../middlewares/validate.js';
import validateCashObligationSchema from '../schemas/cash_obligation_schema.js';

const router = express.Router();


/**
 * @swagger
 * /cash-obligations:
 *   post:
 *     summary: Create a cash obligation
 *     description: Creates a new cash obligation for the authenticated user. Obligations can be one-time or recurring monthly payments.
 *     tags:
 *       - Cash Obligations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - amount
 *               - date
 *               - reminder_days
 *               - is_recurring
 *             properties:
 *               description:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 150
 *                 example: Tagihan listrik bulanan
 *               amount:
 *                 type: number
 *                 exclusiveMinimum: 0
 *                 example: 500000
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-20T00:00:00+07:00"
 *               reminder_days:
 *                 type: integer
 *                 minimum: 0
 *                 description: Jumlah hari sebelum tenggat waktu untuk mengirimkan pengingat.
 *                 example: 3
 *               is_recurring:
 *                 type: boolean
 *                 description: Menunjukkan apakah kewajiban tersebut berulang setiap bulan.
 *                 example: true
 *               recurring_day:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 31
 *                 nullable: true
 *                 description: Tanggal berapa kewajiban ingin diulang? Wajib diisi jika is_recurring bernilai true; harus bernilai null atau tidak diisi jika bernilai false.
 *                 example: 20
 *     responses:
 *       201:
 *         description: Cash obligation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: Newly created cash obligation information.
 *       400:
 *         description: Invalid cash obligation data
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticate, validate(validateCashObligationSchema), cashObligationController.createCashObligation);

/**
 * @swagger
 * /cash-obligations:
 *   get:
 *     summary: Get all cash obligations
 *     description: Retrieves cash obligations belonging to the authenticated user, with an optional filter for upcoming obligations.
 *     tags:
 *       - Cash Obligations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: upcoming
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Jika true, hanya menampilkan kewajiban pembayaran yang mendekati tenggat waktu.
 *         example: true
 *     responses:
 *       200:
 *         description: Daftar kewajiban pembayaran berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Informasi kewajiban pembayaran.
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticate, cashObligationController.getCashObligations);

/**
 * @swagger
 * /cash-obligations/{cashObligationId}:
 *   get:
 *     summary: Get cash obligation by ID
 *     description: Retrieves a specific cash obligation belonging to the authenticated user.
 *     tags:
 *       - Cash Obligations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cashObligationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unik dari kewajiban pembayaran.
 *         example: "1"
 *     responses:
 *       200:
 *         description: Kewajiban pembayaran berhasil ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: Informasi kewajiban pembayaran.
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       404:
 *         description: Kewajiban pembayaran tidak ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Transaction not found
 *       500:
 *         description: Internal server error
 */
router.get('/:cashObligationId', authenticate, cashObligationController.getCashObligationById);

/**
 * @swagger
 * /cash-obligations/{cashObligationId}:
 *   delete:
 *     summary: Delete a cash obligation
 *     description: Deletes a specific cash obligation belonging to the authenticated user.
 *     tags:
 *       - Cash Obligations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cashObligationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unik dari kewajiban pembayaran yang akan dihapus.
 *         example: "1"
 *     responses:
 *       200:
 *         description: Kewajiban pembayaran berhasil dihapus.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Cash obligation successfully deleted!
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       404:
 *         description: Cash obligation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Cash obligation not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:cashObligationId', authenticate, cashObligationController.deleteCashObligation);

/**
 * @swagger
 * /cash-obligations/{cashObligationId}:
 *   put:
 *     summary: Update a cash obligation
 *     description: Memperbarui informasi kewajiban pembayaran milik pengguna yang telah terautentikasi. Hanya kolom yang dikirimkan yang akan diperbarui.
 *     tags:
 *       - Cash Obligations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cashObligationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unik dari kewajiban pembayaran yang akan diperbarui.
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               description:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 150
 *                 example: Tagihan listrik bulanan
 *               amount:
 *                 type: number
 *                 exclusiveMinimum: 0
 *                 example: 500000
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-20T00:00:00+07:00"
 *               reminder_days:
 *                 type: integer
 *                 minimum: 0
 *                 description: Jumlah hari sebelum tenggat waktu untuk mengirimkan pengingat.
 *                 example: 3
 *               is_recurring:
 *                 type: boolean
 *                 description: Menunjukkan apakah kewajiban tersebut berulang setiap bulan.
 *                 example: true
 *               recurring_day:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 31
 *                 nullable: true
 *                 description: Tanggal dalam bulan untuk kewajiban berulang. Wajib diisi jika is_recurring bernilai true; harus bernilai null atau tidak diisi jika sebaliknya.
 *                 example: 20
 *     responses:
 *       200:
 *         description: Kewajiban pembayaran berhasil diperbarui.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     cashObligation:
 *                       type: object
 *                       description: Informasi kewajiban pembayaran yang telah diperbarui.
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       404:
 *         description: Cash obligation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Cash obligation doesnt exist
 *       500:
 *         description: Internal server error
 */
router.put('/:cashObligationId', authenticate, cashObligationController.updateCashObligation);

/**
 * @swagger
 * /cash-obligations/renew/{cashObligationId}:
 *   put:
 *     summary: Renew a cash obligation
 *     description: Memperbarui tenggat waktu kewajiban pembayaran berulang ke bulan berikutnya berdasarkan tanggal berulang yang telah ditentukan. Jika tanggal tersebut tidak tersedia pada bulan berikutnya, tenggat waktu akan ditetapkan pada hari terakhir bulan tersebut.
 *     tags:
 *       - Cash Obligations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cashObligationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unik dari kewajiban pembayaran yang akan diperpanjang.
 *         example: "1"
 *     responses:
 *       200:
 *         description: Tenggat waktu kewajiban pembayaran berhasil diperbarui.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     cashObligation:
 *                       type: object
 *                       description: Informasi kewajiban pembayaran dengan tenggat waktu yang baru.
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       404:
 *         description: Cash obligation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Cash obligation doesnt exist
 *       500:
 *         description: Internal server error
 */
router.put('/renew/:cashObligationId', authenticate, cashObligationController.renewCashObligation);

export default router;