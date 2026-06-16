from pydantic import BaseModel


class EventInput(BaseModel):
    event_type: str
    event_cause: str
    requires_road_closure: str
    priority: str
    corridor: str
    police_station: str
    hour: int
    day_of_week: int
    month: int