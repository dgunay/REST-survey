use actix_web::{get, Responder};

#[get("/health")]
async fn health() -> impl Responder {
    actix_web::HttpResponse::Ok().body("OK")
}
