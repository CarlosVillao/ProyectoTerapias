from fastapi import APIRouter, Depends, HTTPException
from app.services.menu_service import listar_menus_por_rol
from app.services.rol_service import listar_roles  # Para obtener nombre de rol
from app.utils.auth_dependency import obtener_usuario_desde_token
from fastapi.responses import JSONResponse

router = APIRouter(
    tags=["Menús"]
)

@router.get(
    "/por-rol",
    summary="Obtener menús según el rol activo del usuario autenticado",
    response_description="Objeto con lista de menús y nombre del rol"
)
def obtener_menus(usuario=Depends(obtener_usuario_desde_token)):
    """
    Retorna los menús disponibles para el rol activo del usuario autenticado.
    Incluye el nombre del rol para mostrar en el frontend.
    """
    try:
        rol_id = usuario["rol_id"]
        # Listar menús activos
        menus = listar_menus_por_rol(rol_id)

        # Obtener nombre del rol desde la lista de roles
        roles = listar_roles()
        rol_info = next((r for r in roles if r.get("rol_id") == rol_id), None)
        rol_name = rol_info.get("rol_name") if rol_info else ""

        return JSONResponse(content={
            "menus": menus,
            "rol_name": rol_name
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener menús: {str(e)}")

