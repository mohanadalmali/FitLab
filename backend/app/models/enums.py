from enum import Enum

class GenderEnum(Enum):
    Male = "Male"
    Female = "Female"
    Other = "Other"

class GoalEnum(Enum):
    LoseWeight = "lose_weight"
    GainWeight = "gain_weight"
    MaintainWeight = "maintain_weight"

class ActivityLevelEnum(Enum):
    Sedentary = "sedentary"
    LightlyActive = "lightly_active"
    ModeratelyActive = "moderately_active"
    VeryActive = "very_active"
    SuperActive = "super_active"