import { Request, Response } from "express"
import { getRepository } from "typeorm"
import OrphanageModel from "../models/Orphanage"
import DashboardView from "../views/dashboard"

async function fetchOrphanages(pending_approval: boolean) {
  const orphanagesRepository = getRepository(OrphanageModel)

  const result = await orphanagesRepository.find({
    where: { pending_approval }
  })

  return result
}

export default class DashboardController {
  static async index(req: Request, res: Response) {
    const result = await fetchOrphanages(false)

    return res.status(200).json({
      status: 200,
      results: DashboardView.renderMany(result)
    })
  }

  static async indexPending(req: Request, res: Response) {
    const result = await fetchOrphanages(true)

    return res.status(200).json({
      status: 200,
      results: DashboardView.renderMany(result)
    })
  }

  static async update(req: Request, res: Response) {

  }

  static async updatePending(req: Request, res: Response) {

  }

  static async delete(req: Request, res: Response) {

  }
}