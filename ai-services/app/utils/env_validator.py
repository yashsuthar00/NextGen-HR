import os

def validate_env_variables(required_vars):
    """
    Validates that all required environment variables are set.

    :param required_vars: List of required environment variable names.
    :raises EnvironmentError: If any required environment variable is missing.
    """
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        raise EnvironmentError(
            f"Missing required environment variables: {', '.join(missing_vars)}"
        )
