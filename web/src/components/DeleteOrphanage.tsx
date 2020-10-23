import React, { useState } from "react"
import { useHistory, useParams } from "react-router-dom"

// Components
import Feedback from "components/Feedback"

// Contexts
import useDashboard from "contexts/dashboard"
import Loader from "react-loader-spinner"

interface DeleteOrphanageProps {
  type: "registered" | "pending"
}

const DeleteOrphanage: React.FC<DeleteOrphanageProps> = ({ type }) => {
  const { replace, goBack } = useHistory()
  const { id } = useParams() as any
  const dashboardContext = useDashboard()
  const [error, setError] = useState("")

  async function deleteOrphanage() {
    const status = await dashboardContext.deleteOrphanage(Number(id))

    if (status === 200) {
      dashboardContext.callRefetch()
      replace("/acesso-restrito/dashboard/orfanatos")
    } else if (status === 401) {
      setError("unauthorized")
    } else if (status === 404) {
      setError("not-found")
    } else {
      setError("error")
    }
  }

  const errorByUnauthorizedFeedback = (
    <Feedback
      type="error"
      title="Ahhh!"
      subtitle="Você não tem permissão para acessar este conteúdo. 
      Por favor, faça o login e tente novamente."
      actionButtons={[
        {
          type: "danger",
          label: "Fazer login",
          action: () => replace("/acesso-restrito/login")
        },
        {
          type: "danger",
          label: "Voltar para o menu",
          action: () => replace("/")
        }
      ]}
    />
  )

  const errorByNotFoundFeedback = (
    <Feedback
      type="error"
      title="Ahhh!"
      subtitle="Não foi encontrado nenhum orfanato com o id especificado. 
      Tente novamente mais tarde."
      actionButtons={[
        {
          type: "danger",
          label: "Voltar para a dashboard",
          action: () => replace("/acesso-restrito/dashboard")
        }
      ]}
    />
  )

  const errorFeedback = (
    <Feedback
      type="error"
      title="Ahhh!"
      subtitle="Ocorreu algum erro durante a requisição. Tente novamente mais tarde."
      actionButtons={[
        {
          type: "danger",
          label: "Voltar para a dashboard",
          action: () => replace("/acesso-restrito/dashboard")
        }
      ]}
    />
  )

  return (
    error
      ? (
        error === "unauthorized"
          ? errorByUnauthorizedFeedback 
          : (
            error === "not-found"
              ? errorByNotFoundFeedback
              : errorFeedback
          )
      ) : (
        <Feedback
          type="error"
          title={type === "registered" ? "Excluir" : "Rejeitar"
          }
          subtitle={
            type === "registered"
              ? "Tem certeza que quer excluir este orfanato?"
              : "Tem certeza que quer rejeitar este orfanato?"
          }
          actionButtons={
            [
              {
                type: "danger",
                label: dashboardContext.loading
                  ? <Loader type="ThreeDots" color="#FFFFFF" height={60} width={60} />
                  : type === "registered" ? "Excluir orfanato" : "Rejeitar orfanato",
                action: deleteOrphanage
              },
              {
                type: "danger",
                label: "Cancelar",
                action: goBack
              }
            ]}
        />
      )
  )
}

export default DeleteOrphanage