from datetime import datetime

def get_todays_date():
    """Get todays date

    Returns a string on format 'yyyy-mm-dd'
    """
    dt = datetime.today()
    return "{}-{:02d}-{:02d}".format(dt.year, dt.month, dt.day)
