from scripts.main import main


def handler(event, context):
    try:
        print("Starting scraping pipeline...")

        main()

        print("Pipeline completed successfully.")

        return {
            "statusCode": 200,
            "body": {
                "message": "Scraping pipeline completed successfully"
            }
        }

    except Exception as e:
        print(f"Pipeline failed: {str(e)}")

        return {
            "statusCode": 500,
            "body": {
                "message": "Pipeline failed",
                "error": str(e)
            }
        }