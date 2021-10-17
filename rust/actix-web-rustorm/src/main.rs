use actix_web::{App, HttpServer};

mod routes;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(routes::health))
        .bind("0.0.0.0:8080")?
        .run()
        .await
}
