from django.contrib import admin
from apps.todo.models import Todo


# Register your models here.


class TodoAdmin(admin.ModelAdmin):
    list = ('title', 'description', 'completed')


admin.site.register(Todo, TodoAdmin)
